import Image from "next/image";


const Logo = () => {
    return ( 
        <Image  src={"/logo.svg"} height={200} width={200} alt="logo-big" />
     );
}
 
export default Logo;