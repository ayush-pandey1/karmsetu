

export default function PageWrapper({ children }) {
    return (<div className="flex flex-col  space-y-2 bg-zinc-100 flex-grow ">
      {children}
    </div>);
}
