import styles from './DragAndDrop.module.css'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'

interface DragAndDropProps<T> {
  items: T[]
  setItems: (items: T[]) => void
  getId: (item: T) => string
  getContent: (item: T) => string | JSX.Element
}

const DragAndDrop = <T,>({
  items,
  setItems,
  getId,
  getContent,
}: DragAndDropProps<T>) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const orderedItems = Array.from(items)
    const [reorderedItem] = orderedItems.splice(result.source.index, 1)
    orderedItems.splice(result.destination.index, 0, reorderedItem)
    console.log('ordered', orderedItems)
    setItems(orderedItems)
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='items'>
        {(provided) => (
          <ul
            className={styles.listContainer}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items.map((item, index) => (
              <Draggable key={getId(item)} draggableId={getId(item)} index={index}>
                {(provided) => (
                  <li
                    className={styles.listItem}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {getContent(item)}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragAndDrop
