export const logLambdaParams = (name: string, event: unknown): void => {
  console.log(`INVOKE LAMBDA: ${name} WITH EVENT: ${JSON.stringify(event)}`);
}

export const logLambdaError = (name, error: Error): void => {
  console.log(`LAMBDA FAILED: ${name} WITH ERROR: ${error}`);
}
