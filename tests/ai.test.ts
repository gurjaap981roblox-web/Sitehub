/**
 * Automated Test Suite for SiteHub Universal AI Engine & AiService
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AiService } from '../server/ai/aiService';
import { UniversalEngine } from '../server/ai/universalEngine';

describe('SiteHub AI Engine & Synthesizer Tests', () => {
  it('should resolve environment keys and client overrides correctly', () => {
    const keys = AiService.getResolvedKeys({ GEMINI_API_KEY: 'test-custom-gemini-key' });
    assert.strictEqual(keys.geminiKey, 'test-custom-gemini-key');
  });

  it('should synthesize full project for SaaS category', () => {
    const site = UniversalEngine.synthesizeFullProject('Build a modern AI SaaS CRM for sales pipelines');
    assert.ok(site);
    assert.strictEqual(site.category, 'saas_crm');
    assert.ok(site.pages.length >= 1);
    const sections = site.pages[0].sections;
    assert.ok(sections.length >= 4);
    assert.ok(sections.some(s => s.type === 'navbar'));
    assert.ok(sections.some(s => s.type === 'hero'));
    assert.ok(sections.some(s => s.type === 'crmPipeline' || s.type === 'features' || s.type === 'dashboardMetrics'));
    assert.ok(site.theme.primaryColor);
  });

  it('should synthesize full project for Hospitality / Hotel Booking', () => {
    const site = UniversalEngine.synthesizeFullProject('Create a luxury beachfront resort hotel booking portal');
    assert.ok(site);
    assert.strictEqual(site.category, 'hotel_hospitality');
    assert.ok(site.pages[0].sections.some(s => s.type === 'hotelBooking' || s.type === 'booking'));
  });

  it('should synthesize full project for E-commerce Boutique', () => {
    const site = UniversalEngine.synthesizeFullProject('Build an artisan coffee and pastry online shop');
    assert.ok(site);
    assert.strictEqual(site.category, 'ecommerce');
    assert.ok(site.pages[0].sections.some(s => s.type === 'store' || s.type === 'pricing'));
  });

  it('should apply surgical patches to an existing site document', () => {
    const original = UniversalEngine.synthesizeFullProject('Minimalist architecture studio');
    const { updatedSite, patches } = UniversalEngine.applySurgicalPatches('Add a testimonials review section and dark mode theme', original);
    assert.ok(updatedSite);
    assert.ok(patches.length > 0);
    assert.strictEqual(updatedSite.theme.isDark, true);
    assert.ok(updatedSite.pages[0].sections.some(s => s.type === 'testimonials'));
  });

  it('should run AiService.generate and return validated site and steps', async () => {
    const res = await AiService.generate({
      prompt: 'Build a high-converting landing page for a modern fintech app',
      selectedModel: 'gemini-3.8-flash',
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.updatedSite);
    assert.ok(res.updatedSite.pages.length > 0);
    assert.ok(res.steps.length >= 2);
    assert.ok(res.tokensIn > 0);
    assert.ok(res.tokensOut > 0);
  });

  it('should return verified model catalogue with specifications', () => {
    const models = AiService.getModelCatalogue();
    assert.ok(models.length >= 4);
    assert.ok(models.some(m => m.id === 'gemini-3.8-flash'));
    assert.ok(models.some(m => m.id === 'gemini-4-argon'));
    assert.ok(models.some(m => m.id === 'nvidia/nemotron-3-ultra'));
    const gemini = models.find(m => m.id === 'gemini-3.8-flash');
    assert.strictEqual(gemini?.provider, 'google');
    assert.ok(gemini?.contextWindow);
    assert.ok(gemini?.maxOutputTokens);
  });

  it('should execute chat synthesis and extract structured code blocks', async () => {
    const chatRes = await AiService.chat({
      messages: [{ role: 'user', content: 'Generate a button component in React' }],
      model: 'gemini-3.8-flash',
    });

    assert.strictEqual(chatRes.success, true);
    assert.ok(chatRes.text.length > 0);
    assert.ok(chatRes.durationMs >= 0);
    assert.ok(chatRes.tokensIn > 0);
    assert.ok(chatRes.tokensOut > 0);
  });

  it('should generate media assets with aspect ratio and semantic mapping', async () => {
    const mediaRes = await AiService.generateMedia({
      prompt: 'Luxury modern architectural beachfront hotel',
      aspectRatio: '16:9',
      style: 'photorealistic',
    });

    assert.strictEqual(mediaRes.success, true);
    assert.ok(mediaRes.imageUrl.startsWith('http'));
    assert.strictEqual(mediaRes.aspectRatio, '16:9');
  });
});

