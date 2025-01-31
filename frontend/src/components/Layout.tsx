import { ReactNode } from 'react';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu.Root className="bg-white shadow-sm">
        <NavigationMenu.List className="flex p-4 max-w-7xl mx-auto">
          <NavigationMenu.Item className="mr-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="mr-6">
            <Link href="/books" className="text-gray-700 hover:text-blue-600">
              Books
            </Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <Link href="/lendings" className="text-gray-700 hover:text-blue-600">
              Lendings
            </Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <main className="max-w-7xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}
