import * as Form from '@radix-ui/react-form';
import { useState, useEffect } from 'react';
import { booksApi, membersApi, lendingsApi } from '@/services/api';
import { toast } from 'react-hot-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  status: {
    availableQty: number;
  };
}

interface Member {
  id: number;
  name: string;
  status: string;
}

interface LendingFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function LendingForm({ onSuccess, onClose }: LendingFormProps) {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await booksApi.getAll();
      setBooks(data.filter((book: Book) => book.status.availableQty > 0));
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch books';
      setError(message);
      toast.error(message);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await membersApi.getAll();
      setMembers(data.filter((member: Member) => member.status === 'ACTIVE'));
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch members';
      setError(message);
      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        bookId: Number(formData.get('bookId')),
        memberId: Number(formData.get('memberId'))
      };

      await lendingsApi.create(data);
      toast.success('Lending created successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create lending';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded">
            {error}
          </div>
        )}

        <Form.Field name="bookId">
          <Form.Label className="block text-sm font-medium text-gray-700">
            Book
          </Form.Label>
          <Form.Control asChild>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} ({book.status.availableQty} available)
                </option>
              ))}
            </select>
          </Form.Control>
        </Form.Field>

        <Form.Field name="memberId">
          <Form.Label className="block text-sm font-medium text-gray-700">
            Member
          </Form.Label>
          <Form.Control asChild>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </Form.Control>
        </Form.Field>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Lending'}
        </button>
      </div>
    </Form.Root>
  );
} 