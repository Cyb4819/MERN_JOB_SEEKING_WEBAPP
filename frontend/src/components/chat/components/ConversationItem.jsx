export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex gap-3 items-start hover:bg-muted transition-colors border-b border-border text-left ${isSelected ? 'bg-muted' : ''
        }`}
    >

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="font-500 text-foreground truncate">{conversation.name}</h3>
        </div>
      </div>
    </button>
  )
}
export default ConversationItem