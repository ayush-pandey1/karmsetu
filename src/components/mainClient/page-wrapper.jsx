import "./background.css"

export default function PageWrapper({ children }) {
    return (<div className="flex flex-col wrapper bg-zinc-100 flex-grow ">
      {children}
    </div>);
}
