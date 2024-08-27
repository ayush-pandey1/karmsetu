export default function PageWrapper({ children }) {
    return (<div className="flex flex-col md:pt-2 md:px-4 space-y-2 bg-zinc-100 flex-grow md:pb-4">
      {children}
    </div>);
}
