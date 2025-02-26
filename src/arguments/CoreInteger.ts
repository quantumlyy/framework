import type { PieceContext } from '@sapphire/pieces';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveInteger } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<number> {
	private readonly messages = {
		[Identifiers.ArgumentIntegerTooSmall]: ({ minimum }: ArgumentContext) => `The given number must be greater than ${minimum}.`,
		[Identifiers.ArgumentIntegerTooLarge]: ({ maximum }: ArgumentContext) => `The given number must be less than ${maximum}.`,
		[Identifiers.ArgumentIntegerError]: () => 'The argument did not resolve to a valid number.'
	} as const;

	public constructor(context: PieceContext) {
		super(context, { name: 'integer' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<number> {
		const resolved = resolveInteger(parameter, { minimum: context.minimum, maximum: context.maximum });
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: this.messages[resolved.error](context),
			context
		});
	}
}
