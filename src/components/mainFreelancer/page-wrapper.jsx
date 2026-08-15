import "./background.css"

export default function PageWrapper({ children }) {
    return (<div className="wrapper flex flex-col w-full min-w-0 max-w-full space-y-2 bg-zinc-100 flex-grow pb-4">
      {children}
    </div>);
}
