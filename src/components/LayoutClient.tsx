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
								'!rounded-none !border-[3px] !border-black !bg-white !font-bold !text-black !shadow-[5px_5px_0_#000]',
						}}
					/>
				</QueryProvider>
			</SessionProvider>
		</>
	);
};

export default ClientLayout;
