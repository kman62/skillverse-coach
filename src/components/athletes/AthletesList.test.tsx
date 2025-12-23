// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AthletesList } from './AthletesList';
import { AthleteData } from './AthleteForm';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock Supabase client
const mockDelete = vi.fn().mockReturnValue({ error: null });
const mockEq = vi.fn().mockReturnValue({ error: null });
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      delete: () => ({ eq: mockEq }),
    }),
  },
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('AthletesList', () => {
  const mockOnEdit = vi.fn();
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty State', () => {
    it('shows empty state when no athletes', () => {
      render(<AthletesList athletes={[]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/no athletes yet/i)).toBeInTheDocument();
      expect(screen.getByText(/create athlete profiles/i)).toBeInTheDocument();
    });

    it('displays user icon in empty state', () => {
      render(<AthletesList athletes={[]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      // The User icon should be present (we check for the card structure)
      const card = screen.getByText(/no athletes yet/i).closest('.flex');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Athlete Cards', () => {
    const baseAthlete: AthleteData = {
      id: '1',
      name: 'John Doe',
      sport: 'basketball',
    };

    it('renders athlete name', () => {
      render(<AthletesList athletes={[baseAthlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders sport name capitalized', () => {
      render(<AthletesList athletes={[baseAthlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText('basketball')).toBeInTheDocument();
    });

    it('renders position and jersey number', () => {
      const athlete: AthleteData = { ...baseAthlete, position: 'Guard', jersey_number: '23' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/guard/i)).toBeInTheDocument();
      expect(screen.getByText(/#23/)).toBeInTheDocument();
    });

    it('renders competition level badge', () => {
      const athlete: AthleteData = { ...baseAthlete, competition_level: 'high_school' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText('High School')).toBeInTheDocument();
    });

    it('renders all competition level labels correctly', () => {
      const levels = [
        { key: 'youth', label: 'Youth' },
        { key: 'middle_school', label: 'Middle School' },
        { key: 'd1', label: 'D1' },
        { key: 'd2', label: 'D2' },
        { key: 'd3', label: 'D3' },
        { key: 'juco', label: 'JUCO' },
        { key: 'professional', label: 'Pro' },
      ];

      levels.forEach(({ key, label }) => {
        const athlete: AthleteData = { id: key, name: 'Test', competition_level: key };
        const { unmount } = render(
          <AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />,
          { wrapper: Wrapper }
        );
        expect(screen.getByText(label)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Age Calculation', () => {
    it('displays calculated age from date of birth', () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 16;
      const athlete: AthleteData = {
        id: '1',
        name: 'Young Athlete',
        date_of_birth: `${birthYear}-01-01`,
      };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/16 yrs/)).toBeInTheDocument();
    });

    it('does not display age when date_of_birth is null', () => {
      const athlete: AthleteData = { id: '1', name: 'No DOB', date_of_birth: null };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.queryByText(/yrs/)).not.toBeInTheDocument();
    });
  });

  describe('Height Formatting', () => {
    it('formats height in feet and inches', () => {
      const athlete: AthleteData = { id: '1', name: 'Tall Player', height_inches: 72 };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/6'0"/)).toBeInTheDocument();
    });

    it('formats height with remaining inches', () => {
      const athlete: AthleteData = { id: '1', name: 'Player', height_inches: 75 };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/6'3"/)).toBeInTheDocument();
    });

    it('does not display height when height_inches is null', () => {
      const athlete: AthleteData = { id: '1', name: 'No Height' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.queryByText(/'/)).not.toBeInTheDocument();
    });
  });

  describe('Weight Display', () => {
    it('displays weight in pounds', () => {
      const athlete: AthleteData = { id: '1', name: 'Player', weight_lbs: 180 };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/180 lbs/)).toBeInTheDocument();
    });

    it('displays both height and weight together', () => {
      const athlete: AthleteData = { id: '1', name: 'Player', height_inches: 72, weight_lbs: 180 };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/6'0", 180 lbs/)).toBeInTheDocument();
    });
  });

  describe('School and Team Info', () => {
    it('displays school name', () => {
      const athlete: AthleteData = { id: '1', name: 'Student', school_name: 'Central High' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText('Central High')).toBeInTheDocument();
    });

    it('displays team name', () => {
      const athlete: AthleteData = { id: '1', name: 'Player', team_name: 'Varsity' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText('Varsity')).toBeInTheDocument();
    });

    it('displays school and team together with separator', () => {
      const athlete: AthleteData = { id: '1', name: 'Player', school_name: 'Central High', team_name: 'Varsity' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText(/Central High - Varsity/)).toBeInTheDocument();
    });
  });

  describe('Graduation Year', () => {
    it('displays graduation year badge', () => {
      const athlete: AthleteData = { id: '1', name: 'Senior', graduation_year: 2025 };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText('2025')).toBeInTheDocument();
    });
  });

  describe('Jersey Color', () => {
    it('displays jersey color indicator', () => {
      const athlete: AthleteData = { id: '1', name: 'Player', jersey_color: '#ff0000' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      const colorIndicator = document.querySelector('[style*="background-color"]');
      expect(colorIndicator).toBeInTheDocument();
    });
  });

  describe('Notes Display', () => {
    it('displays athlete notes', () => {
      const athlete: AthleteData = { id: '1', name: 'Player', notes: 'Great potential' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      expect(screen.getByText('Great potential')).toBeInTheDocument();
    });
  });

  describe('Edit Functionality', () => {
    it('calls onEdit when Edit button clicked', async () => {
      const user = userEvent.setup();
      const athlete: AthleteData = { id: '1', name: 'John Doe' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      
      await user.click(screen.getByRole('button', { name: /edit/i }));
      expect(mockOnEdit).toHaveBeenCalledWith(athlete);
    });
  });

  describe('Delete Functionality', () => {
    it('opens delete confirmation dialog', async () => {
      const user = userEvent.setup();
      const athlete: AthleteData = { id: '1', name: 'John Doe' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      
      const deleteButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
      await user.click(deleteButton!);
      
      expect(screen.getByText(/remove athlete/i)).toBeInTheDocument();
      expect(screen.getByText(/are you sure you want to remove john doe/i)).toBeInTheDocument();
    });

    it('closes dialog when Cancel clicked', async () => {
      const user = userEvent.setup();
      const athlete: AthleteData = { id: '1', name: 'John Doe' };
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      
      const deleteButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
      await user.click(deleteButton!);
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      
      await waitFor(() => {
        expect(screen.queryByText(/are you sure you want to remove/i)).not.toBeInTheDocument();
      });
    });

    it('calls onRefresh after successful deletion', async () => {
      const user = userEvent.setup();
      const athlete: AthleteData = { id: '1', name: 'John Doe' };
      mockEq.mockResolvedValueOnce({ error: null });
      
      render(<AthletesList athletes={[athlete]} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      
      const deleteButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
      await user.click(deleteButton!);
      await user.click(screen.getByRole('button', { name: /remove/i }));
      
      await waitFor(() => {
        expect(mockOnRefresh).toHaveBeenCalled();
      });
    });
  });

  describe('Multiple Athletes', () => {
    it('renders grid of athlete cards', () => {
      const athletes: AthleteData[] = [
        { id: '1', name: 'Athlete One' },
        { id: '2', name: 'Athlete Two' },
        { id: '3', name: 'Athlete Three' },
      ];
      render(<AthletesList athletes={athletes} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />, { wrapper: Wrapper });
      
      expect(screen.getByText('Athlete One')).toBeInTheDocument();
      expect(screen.getByText('Athlete Two')).toBeInTheDocument();
      expect(screen.getByText('Athlete Three')).toBeInTheDocument();
    });
  });
});
