import { SetMetadata } from '@nestjs/common';
import { Actions } from 'src/consts/actions';
import { Resources } from 'src/consts/resources';

export type AuthorizationDecoratorArgs = {
    permissions: PermissionsArgs[],
    mode?: 'all' | 'any'
}

export type PermissionsArgs = {
    resource: typeof Resources[keyof typeof Resources],
    action: typeof Actions[keyof typeof Actions]
}



export const KEY_AUTHORIZATION = Symbol('authorization')

export const Authorization = (args: AuthorizationDecoratorArgs = { mode: 'all', permissions: [] }) => SetMetadata(KEY_AUTHORIZATION, args);