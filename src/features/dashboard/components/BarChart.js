import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart(){

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
      };
      
      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Berhasil Berkunjung',
      data: labels.map(() => Math.random(1) + 1),
      backgroundColor: 'rgba(53, 162, 235, 1)',
    },
  ],
};




    return(
      <TitleCard title={"Statistik Kunjungan Guru"}>
            <Bar options={options} data={data} />
      </TitleCard>

    )
}


export default BarChart