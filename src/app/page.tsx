import { redirect } from 'next/navigation';

export default function RootPage() {
  // Automatically redirect root path to overview or login
  redirect('/overview');
}
