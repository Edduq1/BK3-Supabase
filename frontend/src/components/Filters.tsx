type Props = {
  categories: string[]
  selectedCategory: string
  onSelect: (c: string) => void
}
export default function Filters({ categories, selectedCategory, onSelect }: Props) {
  return (
    <div className="um-filters">
      {['Todos', ...categories].map((c) => (
        <button key={c} className={c === selectedCategory ? 'um-filter active' : 'um-filter'} onClick={() => onSelect(c)} type="button">{c}</button>
      ))}
    </div>
  )
}