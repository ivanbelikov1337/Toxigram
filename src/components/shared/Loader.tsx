import {FC} from "react";

interface ILoader {

}

const Loader: FC<ILoader> = () => {
    return (
        <div className="flex-center w-full">
            <img src="/assets/icons/loader.svg"
                 alt="Loading"
                 height={24}
                 width={24}
            />

        </div>
    )
}

export default Loader;