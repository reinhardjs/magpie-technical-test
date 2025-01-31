import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { useState } from 'react';
import { booksApi } from '@/services/api';

interface BookFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export default function BookForm({ onSuccess, initialData }: BookFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      if (initialData) {
        await booksApi.update(initialData.id, data);
      } else {
        await booksApi.create(data);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save book:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <Dialog.Title className="text-xl font-semibold mb-4">
          {initialData ? 'Edit Book' : 'Add New Book'}
        </Dialog.Title>

        <Form.Root onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Form.Field name="title">
              <Form.Label className="block text-sm font-medium text-gray-700">
                Title
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={initialData?.title}
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="author">
              <Form.Label className="block text-sm font-medium text-gray-700">
                Author
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={initialData?.author}
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="isbn">
              <Form.Label className="block text-sm font-medium text-gray-700">
                ISBN
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={initialData?.isbn}
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="quantity">
              <Form.Label className="block text-sm font-medium text-gray-700">
                Quantity
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="number"
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={initialData?.quantity || 1}
                  required
                />
              </Form.Control>
            </Form.Field>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Portal>
  );
} 