

export default function PageWrapper({ children }) {
    return (<div className="flex flex-col bg-zinc-100 flex-grow ">
      {children}
    </div>);
}
