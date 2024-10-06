
import { Link } from "react-router-dom"
import Title from "../../../components/Typography/Title"

import HeartIcon from "@heroicons/react/24/outline/HeartIcon"




function AmountStats({}){
  
    return(
        <>
        
        <div className="stats bg-base-100 shadow">
  <Link to={"/app/data/siswa"} className="stat" style={{ width: "100%" }}>
  <div className="flex mt-2 sm:mt-8 sm:mb-8">
      <i className="fa-solid fa-user text-xl sm:text-3xl mr-4"></i>
      <div className="text-Lg sm:text-3xl font-bold">Data User</div>
    </div>
  </Link>

  <div className="stat" style={{ width: "100%" }}>
  <Link to={"/app/rekap-absensi"} >
  <div className="flex mt-2 sm:mt-8 sm:mb-8">
      <i className="fa-solid fa-file text-xl sm:text-3xl mr-4"></i>
      <div className="text-Lg sm:text-3xl font-bold">Rekap Absen</div>
    </div>
  </Link>
  </div>
</div>

<div className="stats bg-base-100 shadow">
<Link to={"/app/laporan-pkl"} className="stat" style={{ width: "100%" }}>
  <div className="flex mt-3 sm:mt-8 sm:mb-8">
      <i className="fa-solid fa-arrow-down text-xl sm:text-3xl mr-4"></i>
      <div className="text-Lg sm:text-3xl font-bold">Laporan Kegiatan</div>
    </div>
  </Link>

  <div className="stat" style={{ width: "100%" }}>
  <Link to={"/app/rekapnilai"} >
    <div className="flex mt-3 sm:mt-9 sm:mb-7">
      <i className="fa-solid fa-graduation-cap text-xl sm:text-3xl mr-4"></i>
      <div className="text-Lg sm:text-3xl font-bold">Penilaian Siswa</div>
    </div>
  </Link>
  </div>
</div>


        </>

        

        

        
    )
}

export default AmountStats