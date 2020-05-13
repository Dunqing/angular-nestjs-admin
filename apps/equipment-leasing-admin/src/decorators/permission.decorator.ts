import { SetMetadata } from '@nestjs/common';
import { PERMISSION_IDENTIFIER, PERMISSION_NAME_PREFIX } from '../constants/meta.constant';
import { Identifier, NamePrefix } from '../interfaces/permission.interface';

export function PermissionNamePrefix(name: NamePrefix) {
  return SetMetadata(PERMISSION_NAME_PREFIX, name)
}

export function PermissionIdentifier(identifier: Identifier) {
  return SetMetadata(PERMISSION_IDENTIFIER, identifier)
}