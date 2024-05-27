import spinner from '../../assets/spinner.svg'

import './styles.css'

export default function Spinner() {
  return (
    <div className="loading">
      <img src={spinner} alt="Loading..." />
    </div>
  )
}
