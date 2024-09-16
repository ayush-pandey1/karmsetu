import Image from "next/image";
import '@/app/globals.css';
import Link from "next/link";

const NotFound = () => {
  return (
    <html>
      <body className="overflow-hidden pb-10 pt-10   flex items-center justify-center px-5">
        <div className=" mx-auto w-full text-center ">
        <Image
            src="/images/karmsetuLogo-cropped.svg"
            alt="karmsetu"
            className="mx-auto mb-7.5"
            width={200}
            height={200}
            
          />
          <Image
            src="/404.svg"
            alt="404"
            className="mx-auto mb-7.5"
            width={400}
            height={400}
            
          />

          <h2 className="mb-5 text-xl font-semibold text-primary dark:text-white md:text-4xl">
            Oops! Looks like you got lost
          </h2>
          <p className="mb-7.5">
            The page you were looking for appears to have been moved, deleted or
            does not exist.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
          >
            Return to Home
            <svg
              className="fill-white"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                fill=""
              />
            </svg>
          </Link>
        </div>
      </body>
    </html>
  );
};
export default NotFound;
