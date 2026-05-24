import './global.css';

export const metadata = {
  title: 'Starter',
  description: 'Fullstack monorepo starter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
