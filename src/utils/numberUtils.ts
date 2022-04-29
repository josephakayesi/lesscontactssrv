export function toDecimalPlaces(number: number, numberOfDecimalPlace: number): number {
	return parseFloat(number.toFixed(numberOfDecimalPlace))
}
