import Image from "next/image"
import "./style.css"

const Soon = () => {
  return (
    <div className="h- w-full flex flex-col justify-center items-center pt-52 sm:pt-29 ">
        {" "}
        <Image
          alt="will be added soon"
          src="/soon.svg"
          className="size-72 sm:size-96"
          height={0}
          width={0}
        />
        <div>
          <span className="pt-4 text-lg">This Feature will be added <span className="underline-soon relative">soon</span></span>
        </div>
      </div>
  )
}

export default Soon