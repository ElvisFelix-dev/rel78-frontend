export default function Switch({ isChecked, onToggle, statusText }) {
  const toggleSwitch = () => {
    const newStatus = !isChecked
    onToggle(newStatus) // Chama a função onToggle com o novo valor
  }

  return (
    <label className="cursor-pointer text-green-500">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0"
        checked={isChecked}
        onChange={toggleSwitch}
      />
      {statusText}
    </label>
  )
}
