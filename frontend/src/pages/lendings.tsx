import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Layout from '@/components/Layout';
import { lendingsApi } from '@/services/api';
import { format } from 'date-fns';
import LendingForm from '@/components/LendingForm';
import { canManageLibrary } from '../utils/auth';

interface Lending {
  id: number;
  book: {
    title: string;
    author: string;
  };
  member: {
    name: string;
  };
  borrowedDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
}

export default function Lendings() {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!canManageLibrary()) return
    fetchLendings();
  }, []);

  const fetchLendings = async () => {
    try {
      const response = await lendingsApi.getAll();
      setLendings(response.data);
    } catch (error) {
      console.error('Failed to fetch lendings:', error);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      await lendingsApi.return(id);
      fetchLendings();
    } catch (error) {
      console.error('Failed to return book:', error);
    }
  };

  const filteredLendings = lendings.filter(lending =>
    lending.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lending.member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search lendings..."
            className="border rounded-md px-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog.Root open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Dialog.Trigger asChild>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                New Lending
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <Dialog.Title className="text-xl font-semibold mb-4">
                  New Lending
                </Dialog.Title>
                <LendingForm 
                  onSuccess={fetchLendings}
                  onClose={() => setIsAddDialogOpen(false)}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Borrowed Date
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLendings.map((lending) => (
              <tr key={lending.id}>
                <td className="px-6 py-4 whitespace-nowrap">{lending.book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lending.member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(lending.borrowedDate), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(lending.dueDate), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lending.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lending.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleReturn(lending.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
