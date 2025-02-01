import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { booksApi } from '@/services/api';
import BookForm from './BookForm';
import { toast } from 'react-hot-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  status: {
    availableQty: number;
    borrowedQty: number;
  };
  category: {
    name: string;
  };
}

interface BookListProps {
  books: Book[];
  onUpdate: () => void;
}

export default function BookList({ books, onUpdate }: BookListProps) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await booksApi.delete(id);
        toast.success('Book deleted successfully');
        onUpdate();
      } catch (error: any) {
        console.error('Failed to delete book:', {
          id,
          error: error.message,
          response: error.response?.data
        });
        
        const message = error.response?.data?.error || 'Failed to delete book';
        toast.error(message);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ISBN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Available
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id}>
              <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
              <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {book.status.availableQty} / {book.status.availableQty + book.status.borrowedQty}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{book.category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <Dialog.Root open={editingBook?.id === book.id} onOpenChange={(open) => !open && setEditingBook(null)}>
                  <Dialog.Trigger asChild>
                    <button className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                  </Dialog.Trigger>
                  {editingBook?.id === book.id && (
                    <BookForm
                      initialData={book}
                      onSuccess={() => {
                        setEditingBook(null);
                        onUpdate();
                      }}
                    />
                  )}
                </Dialog.Root>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
