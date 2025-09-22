'use client';

import { useState, useEffect } from 'react';
import EmailModal from '@/components/ui/EmailModal';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
    setHasShownModal(true); // Set state to remember it has been shown
    // Set an item in localStorage to persist this across sessions
    localStorage.setItem('hasShownEmailModal', 'true');
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Check localStorage on component mount
    const modalShown = localStorage.getItem('hasShownEmailModal');
    if (modalShown) {
      setHasShownModal(true);
      return; // Do nothing if the modal has already been shown
    }

    const handleUserInteraction = () => {
      if (!hasShownModal) {
        handleShowModal();
        document.removeEventListener('click', handleUserInteraction);
      }
    };

    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [hasShownModal]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      {showModal && <EmailModal onClose={handleHideModal} />}
    </div>
  );
}