import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastContainer, ThemeProviderWrapper } from "@julseb-lib/react"
import {
	AuthProviderWrapper,
	ModalOpenProviderWrapper,
	/* Prepend context import - DO NOT REMOVE */
} from "context"
import { ErrorPage, NotFoundPage } from "pages"

const queryClient = new QueryClient()

export const Route = createRootRoute({
	component: () => (
		<QueryClientProvider client={queryClient}>
			<ThemeProviderWrapper defaultTheme="light">
				<AuthProviderWrapper>
					<ModalOpenProviderWrapper>
						<Outlet />
						<ToastContainer position="bottom-right" />
						<TanStackRouterDevtools />
					</ModalOpenProviderWrapper>
				</AuthProviderWrapper>
			</ThemeProviderWrapper>
		</QueryClientProvider>
	),
	errorComponent: ErrorPage,
	notFoundComponent: NotFoundPage,
})
