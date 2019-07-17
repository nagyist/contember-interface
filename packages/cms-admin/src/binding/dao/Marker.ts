import { ConnectionMarker } from './ConnectionMarker'
import { FieldMarker } from './FieldMarker'
import { MarkerTreeRoot } from './MarkerTreeRoot'
import { ReferenceMarker } from './ReferenceMarker'

export type Marker = FieldMarker | ReferenceMarker | ConnectionMarker | MarkerTreeRoot
