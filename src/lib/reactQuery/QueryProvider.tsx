import {FC, ReactNode} from "react";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

interface IQueryProvider {
    children: ReactNode
}

const queryClient = new QueryClient()

const QueryProvider: FC<IQueryProvider> = ({children}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryProvider;