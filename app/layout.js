import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Smartq - Smart Queue & Appointment Management",
  description: "The smart way to manage queues and appointments. Reduce wait times and improve customer experience with real-time updates.",
  keywords: "queue management, appointment booking, wait time, customer service, business efficiency",
  authors: [{ name: "Smartq Team" }],
  creator: "Smartq",
  publisher: "Smartq",
  robots: "index, follow",
  openGraph: {
    title: "Smartq - Smart Queue & Appointment Management",
    description: "The smart way to manage queues and appointments. Reduce wait times and improve customer experience.",
    type: "website",
    locale: "en_US",
    siteName: "Smartq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smartq - Smart Queue & Appointment Management",
    description: "The smart way to manage queues and appointments. Reduce wait times and improve customer experience.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
