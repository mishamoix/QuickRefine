'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/providers/QueryProvider';

const ClientLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<SessionProvider>
				<QueryProvider>
					{children}

					<Toaster
						position='bottom-center'
						toastOptions={{
							duration: 3000,
							className:
								'!rounded-xl !border !border-base-300 !bg-base-100 !text-base-content !shadow-md',
						}}
					/>
				</QueryProvider>
			</SessionProvider>
		</>
	);
};

export default ClientLayout;
