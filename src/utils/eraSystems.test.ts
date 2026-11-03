import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ERA_SYSTEMS,
  ERA_LIST,
  getEraDefinition,
  createThemeForEra
} from './eraSystems';
import { EraSystemId } from '../types';

test('ERA_SYSTEMS contains all 6 distinct design eras with complete metadata', () => {
  const expectedEras: EraSystemId[] = [
    'cognify-bento',
    'cyberpunk-neon',
    'classic-90s-erp',
    'swiss-bauhaus',
    'neo-brutalist',
    'executive-luxury'
  ];

  assert.equal(ERA_LIST.length, 6);

  expectedEras.forEach((eraId) => {
    const era = ERA_SYSTEMS[eraId];
    assert.ok(era, `Era ${eraId} must exist`);
    assert.equal(era.id, eraId);
    assert.ok(era.name.length > 0, `${eraId} has a valid name`);
    assert.ok(era.primaryColor.startsWith('#') || era.primaryColor.startsWith('rgb'), `${eraId} has valid primaryColor`);
    assert.ok(era.accentColor.startsWith('#') || era.accentColor.startsWith('rgb'), `${eraId} has valid accentColor`);
    assert.ok(era.appBackground.startsWith('#') || era.appBackground.startsWith('rgb'), `${eraId} has valid appBackground`);
    assert.ok(era.shellBackground.startsWith('#') || era.shellBackground.startsWith('rgb'), `${eraId} has valid shellBackground`);
    assert.ok(era.cardBackground.startsWith('#') || era.cardBackground.startsWith('rgb'), `${eraId} has valid cardBackground`);
    assert.ok(era.iconEmoji.length > 0, `${eraId} has an emoji`);
  });
});

test('getEraDefinition returns requested era or falls back safely to cognify-bento', () => {
  const cyber = getEraDefinition('cyberpunk-neon');
  assert.equal(cyber.id, 'cyberpunk-neon');
  assert.equal(cyber.name, 'Cyberpunk Neo-Ops');

  // @ts-expect-error fallback test
  const unknown = getEraDefinition('unknown-era');
  assert.equal(unknown.id, 'cognify-bento');
});

test('createThemeForEra generates a full BrandThemeConfig with the target era properties', () => {
  const ninetiesTheme = createThemeForEra('classic-90s-erp', {
    companyName: 'Open Technology PLC'
  });

  assert.equal(ninetiesTheme.era, 'classic-90s-erp');
  assert.equal(ninetiesTheme.primaryColor, '#000080');
  assert.equal(ninetiesTheme.accentColor, '#008080');
  assert.equal(ninetiesTheme.borderRadius, 'sharp');
  assert.equal(ninetiesTheme.density, 'compact');
  assert.equal(ninetiesTheme.companyName, 'Open Technology PLC');

  const bentoTheme = createThemeForEra('cognify-bento');
  assert.equal(bentoTheme.era, 'cognify-bento');
  assert.equal(bentoTheme.borderRadius, 'rounded');
  assert.equal(bentoTheme.density, 'comfortable');
});
