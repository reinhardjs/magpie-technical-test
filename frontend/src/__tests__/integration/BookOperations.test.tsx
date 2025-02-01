import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Books from '@/pages/books';
import { booksApi } from '@/services/api';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the API calls
vi.mock('@/services/api', () => ({
  booksApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockBooks = [
  {
    id: 1,
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
    status: { availableQty: 5, borrowedQty: 0 },
    category: { name: 'Fiction' }
  }
];

describe('Book Operations Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Mock successful book fetch
    booksApi.getAll.mockResolvedValue({ data: mockBooks });
  });

  it('should show/hide management options based on user role', async () => {
    // Setup as MEMBER
    localStorage.setItem('user', JSON.stringify({ role: 'MEMBER' }));
    localStorage.setItem('token', 'fake-token');

    render(
      <AuthProvider>
        <Books />
      </AuthProvider>
    );

    // Wait for books to load
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    // MEMBER should not see management options
    expect(screen.queryByText('Add Book')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();

    // Change to LIBRARIAN
    localStorage.setItem('user', JSON.stringify({ role: 'LIBRARIAN' }));
    
    render(
      <AuthProvider>
        <Books />
      </AuthProvider>
    );

    // LIBRARIAN should see management options
    await waitFor(() => {
      expect(screen.getByText('Add Book')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('should handle book operations based on permissions', async () => {
    // Setup as LIBRARIAN
    localStorage.setItem('user', JSON.stringify({ role: 'LIBRARIAN' }));
    localStorage.setItem('token', 'fake-token');

    booksApi.create.mockResolvedValue({ 
      data: { ...mockBooks[0], id: 2 } 
    });

    render(
      <AuthProvider>
        <Books />
      </AuthProvider>
    );

    // Test book creation
    const addButton = await screen.findByText('Add Book');
    fireEvent.click(addButton);

    // Fill form and submit
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Book' }
    });
    fireEvent.change(screen.getByLabelText('Author'), {
      target: { value: 'New Author' }
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(booksApi.create).toHaveBeenCalled();
      expect(booksApi.getAll).toHaveBeenCalledTimes(2); // Initial + after create
    });
  });
}); 