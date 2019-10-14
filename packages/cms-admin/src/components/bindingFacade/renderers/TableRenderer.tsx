import * as React from 'react'
import { ContentLayoutRendererProps } from './ContentLayoutRenderer'

export interface TableRendererProps extends ContentLayoutRendererProps {
	tableHeader?: React.ReactNode
}

export class TableRenderer extends React.PureComponent<any & TableRendererProps> {
	public render() {
		return null
		/*<CollectionRenderer data={this.props.data}>
				{(rawData, entities) => (
					<>
						{DefaultRenderer.renderTitleBar(this.props)}
						{this.props.beforeContent}
						{(entities.length > 0 || this.props.tableHeader) && (
							<Table heading={this.props.tableHeader}>
								{entities.map(value => (
									<AccessorContext.Provider value={value} key={value.getKey()}>
										<TableRow>{this.props.children}</TableRow>
									</AccessorContext.Provider>
								))}
							</Table>
						)}
						{!!entities.length || <div>There are no items to display.</div>}
					</>
				)}
			</CollectionRenderer>*/
	}
}