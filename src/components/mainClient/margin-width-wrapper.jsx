export default function MarginWidthWrapper({ children, }) {
    return (<div className="flex flex-col md:ml-60 sm:border-r sm:border-zinc-700 min-h-screen">
      {children}
    </div>);
}
