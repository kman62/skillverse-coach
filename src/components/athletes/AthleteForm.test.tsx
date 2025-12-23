// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AthleteForm, AthleteData } from './AthleteForm';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock Supabase client
const mockInsert = vi.fn().mockReturnValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ error: null }) });
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }) },
    from: vi.fn().mockReturnValue({
      insert: mockInsert,
      update: mockUpdate,
    }),
  },
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('AthleteForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  describe('Basic Rendering', () => {
    it('renders form with basic fields', () => {
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      expect(screen.getByLabelText(/athlete name/i)).toBeInTheDocument();
      expect(screen.getByText(/primary sport/i)).toBeInTheDocument();
      expect(screen.getByText(/competition level/i)).toBeInTheDocument();
    });

    it('renders accordion sections', () => {
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      expect(screen.getByText(/school & team information/i)).toBeInTheDocument();
      expect(screen.getByText(/physical measurables/i)).toBeInTheDocument();
    });

    it('renders Create Athlete button for new athlete', () => {
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      expect(screen.getByRole('button', { name: /create athlete/i })).toBeInTheDocument();
    });

    it('renders Update Athlete button when editing', () => {
      const athlete: AthleteData = { id: 'test', name: 'John', sport: 'basketball' };
      render(<AthleteForm athlete={athlete} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      expect(screen.getByRole('button', { name: /update athlete/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows validation error when name is empty', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      await user.click(screen.getByRole('button', { name: /create athlete/i }));
      await waitFor(() => expect(screen.getByText(/name is required/i)).toBeInTheDocument());
    });

    it('shows validation error when name is too short', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      await user.type(screen.getByLabelText(/athlete name/i), 'A');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));
      await waitFor(() => expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument());
    });

    it('shows validation error when name exceeds max length', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      const longName = 'A'.repeat(101);
      await user.type(screen.getByLabelText(/athlete name/i), longName);
      await user.click(screen.getByRole('button', { name: /create athlete/i }));
      await waitFor(() => expect(screen.getByText(/100 characters/i)).toBeInTheDocument());
    });

    it('validates jersey number is not too long', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      await user.type(screen.getByLabelText(/athlete name/i), 'Valid Name');
      await user.type(screen.getByLabelText(/jersey number/i), '123456');
      await user.click(screen.getByRole('button', { name: /create athlete/i }));
      await waitFor(() => expect(screen.getByText(/max 5 characters/i)).toBeInTheDocument());
    });
  });

  describe('Conditional Field Display - Competition Level', () => {
    it('shows academic info section for high school level', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      // Open competition level dropdown and select high school
      const levelTrigger = screen.getByText(/select level/i);
      await user.click(levelTrigger);
      await user.click(screen.getByText(/high school/i));
      
      // Academic Info section should now be visible
      expect(screen.getByText(/academic information/i)).toBeInTheDocument();
    });

    it('shows academic info section for JUCO level', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const levelTrigger = screen.getByText(/select level/i);
      await user.click(levelTrigger);
      await user.click(screen.getByText(/juco/i));
      
      expect(screen.getByText(/academic information/i)).toBeInTheDocument();
    });

    it('shows academic info section for D1 level', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const levelTrigger = screen.getByText(/select level/i);
      await user.click(levelTrigger);
      await user.click(screen.getByText(/^d1$/i));
      
      expect(screen.getByText(/academic information/i)).toBeInTheDocument();
    });

    it('hides academic info section for youth level', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const levelTrigger = screen.getByText(/select level/i);
      await user.click(levelTrigger);
      await user.click(screen.getByText(/youth/i));
      
      expect(screen.queryByText(/academic information/i)).not.toBeInTheDocument();
    });

    it('hides academic info section for professional level', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const levelTrigger = screen.getByText(/select level/i);
      await user.click(levelTrigger);
      await user.click(screen.getByText(/professional/i));
      
      expect(screen.queryByText(/academic information/i)).not.toBeInTheDocument();
    });
  });

  describe('Conditional Field Display - Sport Specific', () => {
    it('shows football positions when football is selected', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/football/i));
      
      const positionTrigger = screen.getByText(/select position/i);
      await user.click(positionTrigger);
      
      expect(screen.getByText(/quarterback/i)).toBeInTheDocument();
      expect(screen.getByText(/running back/i)).toBeInTheDocument();
    });

    it('shows basketball positions when basketball is selected', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/basketball/i));
      
      const positionTrigger = screen.getByText(/select position/i);
      await user.click(positionTrigger);
      
      expect(screen.getByText(/point guard/i)).toBeInTheDocument();
      expect(screen.getByText(/center/i)).toBeInTheDocument();
    });

    it('shows baseball positions when baseball is selected', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/baseball/i));
      
      const positionTrigger = screen.getByText(/select position/i);
      await user.click(positionTrigger);
      
      expect(screen.getByText(/pitcher/i)).toBeInTheDocument();
      expect(screen.getByText(/catcher/i)).toBeInTheDocument();
    });

    it('shows soccer positions when soccer is selected', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/soccer/i));
      
      const positionTrigger = screen.getByText(/select position/i);
      await user.click(positionTrigger);
      
      expect(screen.getByText(/goalkeeper/i)).toBeInTheDocument();
      expect(screen.getByText(/striker/i)).toBeInTheDocument();
    });

    it('shows batting side field for baseball', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/baseball/i));
      
      expect(screen.getByText(/bats/i)).toBeInTheDocument();
    });

    it('shows throwing arm field for baseball', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/baseball/i));
      
      expect(screen.getByText(/throws/i)).toBeInTheDocument();
    });

    it('shows preferred foot field for soccer', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/soccer/i));
      
      expect(screen.getByText(/preferred foot/i)).toBeInTheDocument();
    });

    it('shows dominant hand field for tennis', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const sportTrigger = screen.getByText(/select sport/i);
      await user.click(sportTrigger);
      await user.click(screen.getByText(/tennis/i));
      
      expect(screen.getByText(/dominant hand/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onCancel when Cancel clicked', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('allows typing in text fields', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const nameInput = screen.getByLabelText(/athlete name/i);
      await user.type(nameInput, 'Test Athlete');
      expect(nameInput).toHaveValue('Test Athlete');
    });

    it('allows typing in jersey number field', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const jerseyInput = screen.getByLabelText(/jersey number/i);
      await user.type(jerseyInput, '23');
      expect(jerseyInput).toHaveValue('23');
    });

    it('expands accordion sections on click', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      const schoolSection = screen.getByText(/school & team information/i);
      await user.click(schoolSection);
      
      // After clicking, the content should be visible
      await waitFor(() => {
        expect(screen.getByLabelText(/school name/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Population (Edit Mode)', () => {
    it('populates form fields with athlete data', () => {
      const athlete: AthleteData = {
        id: 'test-id',
        name: 'John Doe',
        sport: 'basketball',
        position: 'Point Guard',
        jersey_number: '23',
        competition_level: 'high_school',
      };
      render(<AthleteForm athlete={athlete} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      expect(screen.getByLabelText(/athlete name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/jersey number/i)).toHaveValue('23');
    });

    it('displays selected sport in edit mode', () => {
      const athlete: AthleteData = {
        id: 'test-id',
        name: 'John Doe',
        sport: 'basketball',
      };
      render(<AthleteForm athlete={athlete} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      expect(screen.getByText(/basketball/i)).toBeInTheDocument();
    });
  });

  describe('Height Input Fields', () => {
    it('renders feet and inches inputs in physical measurables section', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      // Expand physical measurables accordion
      await user.click(screen.getByText(/physical measurables/i));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/feet/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/inches/i)).toBeInTheDocument();
      });
    });

    it('renders weight input in physical measurables section', async () => {
      const user = userEvent.setup();
      render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
      
      await user.click(screen.getByText(/physical measurables/i));
      
      await waitFor(() => {
        expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
      });
    });
  });
});
