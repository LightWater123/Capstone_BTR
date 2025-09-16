import btrlogo from '../../assets/btrlogo.png';

export default function BTRheader(){

    return(
    <header className="w-full bg-[#FCFC62] shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        {/* logo */}
        <img src={btrlogo} alt="Logo" className="h-20 w-20" />

        {/*title */}
        <h1 className="font-serif text-xl md:text-2xl text-[#2F549A] text-center flex-1">
            REPUBLIC OF THE PHILIPPINES <br />
            <span className="text-2xl md:text-3xl font-bold">
                BUREAU OF THE TREASURY
                </span>
                </h1>

        {/* margin */}
        <div className="h-12 w-12" />
      </div>
    </header>
    );
}