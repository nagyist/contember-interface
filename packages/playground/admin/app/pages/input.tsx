import { Slots } from '../../lib/components/slots'
import { EntitySubTree, useField } from '@contember/interface'
import { CheckboxField, InputField, RadioEnumField, TextareaField } from '../../lib/components/form'
import * as React from 'react'
import { Button } from '../../lib/components/ui/button'
import { Binding, PersistButton } from '../../lib/components/binding'
import { SelectOrTypeField } from '../../lib-extra/select-or-type-field'
import { FieldExists } from '../../lib-extra/has-field'


export const basic = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'InputRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<InputField field={'textValue'} label={'Text'} description={'Hello world'} />
				<InputField field={'intValue'} label={'Number'} />
				<InputField field={'floatValue'} label={'Float'} />
				<InputField field={'dateValue'} label={'Date'} />
				<InputField field={'datetimeValue'} label={'Date time'} />

				<FieldExists field={'nonExistingField'}>
					<InputField field={'nonExistingField'} label={'Date time'} />
				</FieldExists>
			</div>
		</EntitySubTree>
	</Binding>
</>


export const selectOrType = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'InputRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<SelectOrTypeField field={'textValue'} label={'Text'} options={{
					a: 'Option A',
					b: 'Option B',
				}}/>
			</div>
		</EntitySubTree>
	</Binding>
</>

export const textarea = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'InputRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<TextareaField field={'textValue'} label={'Text'} description={'Hello world'} />
			</div>
		</EntitySubTree>
	</Binding>
</>

export const checkbox = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'InputRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<CheckboxField field={'boolValue'} label={'Some boolean'} description={'Hello world'} />
			</div>
		</EntitySubTree>
	</Binding>
</>

export const enumRadio = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'InputRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<RadioEnumField field={'enumValue'} label={'Some enum'} options={{
					a: 'Option A',
					b: 'Option B',
					c: 'Option C',
				}} />
			</div>
		</EntitySubTree>
	</Binding>
</>


const FillValue = () => {
	const field = useField('textValue')
	const checkbox = useField('boolValue')
	return <>
		<Button onClick={() => field.updateValue('123')}>Fill invalid</Button>
		<Button onClick={() => field.updateValue('abc')}>Fill valid</Button>
		<Button onClick={() => checkbox.updateValue(null)}>Set checkbox null</Button>
		<Button onClick={() => checkbox.updateValue(true)}>Set checkbox true</Button>
		<Button onClick={() => checkbox.updateValue(false)}>Set checkbox false</Button>
	</>
}
export const clientValidation = () => <>
	<Binding>
		<Slots.Actions>
			<PersistButton />
		</Slots.Actions>
		<EntitySubTree entity={'InputRoot(unique=unique)'} setOnCreate={'(unique=unique)'}>
			<div className={'space-y-4'}>
				<div className={'pl-52 space-x-4'}>
					<FillValue />
				</div>
				<InputField field={'textValue'} label={'Name'} required inputProps={{ pattern: '[a-z]+' }} />
				<InputField field={'intValue'} label={'Number'} inputProps={{ required: true, max: 100 }} />
				<CheckboxField field={'boolValue'} label={'Some boolean'} description={'Hello world'} inputProps={{ required: true }} />
				<InputField field={'uuidValue'} label={'UUID'}  />
			</div>
		</EntitySubTree>
	</Binding>
</>
