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
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const handleDelete = async () => {
    if (!deletingBook) return;

    try {
      await booksApi.delete(deletingBook.id);
      toast.success('Book deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to delete book:', {
        id: deletingBook.id,
        error: error.message,
        response: error.response?.data
      });
      
      const message = error.response?.data?.error || 'Failed to delete book';
      toast.error(message);
    } finally {
      setDeletingBook(null);
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
          {books.map((book) => { 
            console.log("LOG: ", deletingBook?.id)
            console.log("LOG: ", book.id)
            return (
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

                <Dialog.Root open={deletingBook?.id === book.id} onOpenChange={(open) => !open && setDeletingBook(null)}>
                  <Dialog.Trigger asChild>
                    <button className="text-red-600 hover:text-red-800" onClick={ () => {
                      setDeletingBook(book)
                    }}>
                      Delete
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
                      <Dialog.Title className="text-xl font-semibold mb-4">
                        Confirm Deletion
                      </Dialog.Title>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to delete "{book.title}"? This action cannot be undone.
                      </p>
                      <div className="flex justify-end space-x-3">
                        <Dialog.Close asChild>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}
