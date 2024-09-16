import Image from "next/image"
import "./style.css"

const Empty = () => {
  return (
    <div className="h- w-full flex flex-col justify-center items-center  ">
        {" "}
        <Image
          alt="will be added soon"
          src="/Empty.svg"
          className="size-72 sm:size-96"
          height={0}
          width={0}
        />
        <div>
          <span className="pt-4 text-lg">Oops! It's <span className="underline-soon relative">Empty</span></span>
        </div>
      </div>
  )
}

export default Empty