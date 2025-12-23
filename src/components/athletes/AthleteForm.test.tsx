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
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }) },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({ error: null }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ error: null }) }),
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

  it('shows validation error when name empty', async () => {
    const user = userEvent.setup();
    render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
    await user.click(screen.getByRole('button', { name: /create athlete/i }));
    await waitFor(() => expect(screen.getByText(/name is required/i)).toBeInTheDocument());
  });

  it('calls onCancel when Cancel clicked', async () => {
    const user = userEvent.setup();
    render(<AthleteForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('shows Update button when editing', () => {
    const athlete: AthleteData = { id: 'test', name: 'John', sport: 'basketball' };
    render(<AthleteForm athlete={athlete} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /update athlete/i })).toBeInTheDocument();
  });
});
