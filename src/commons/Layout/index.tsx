import React, { ReactNode } from 'react';
import HeaderPage from '../HeaderPage';
import FooterPage from '../FooterPage';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <HeaderPage />
      <main>{children}</main>

      <footer >
        <FooterPage />
      </footer>
    </div>
  );
};

export default Layout;
