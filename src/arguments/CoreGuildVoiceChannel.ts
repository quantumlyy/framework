import type { PieceContext } from '@sapphire/pieces';
import type { VoiceChannel } from 'discord.js';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveGuildVoiceChannel } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<VoiceChannel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'guildVoiceChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<VoiceChannel> {
		const { guild } = context.message;
		if (!guild) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentGuildChannelMissingGuildError,
				message: 'This command can only be used in a server.',
				context
			});
		}

		const resolved = resolveGuildVoiceChannel(parameter, guild);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The given argument did not resolve to a valid voice channel.',
			context: { ...context, guild }
		});
	}
}
