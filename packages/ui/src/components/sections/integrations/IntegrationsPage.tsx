import React from 'react';
import { SettingsPageLayout } from '@/components/sections/shared/SettingsPageLayout';
import { useI18n } from '@/lib/i18n';
import { JiraSection } from '@/components/sections/integrations/JiraSection';
import { ComingSoonMessengersSection } from './ComingSoonMessengersSection';
import { ThirdPartyIntegrationsSection } from './ThirdPartyIntegrationsSection';

interface IntegrationsPageProps {
  onOpenProviderSetup: (providerId: string) => Promise<boolean>;
  onOpenPluginManager: () => void;
}

export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({
  onOpenProviderSetup,
  onOpenPluginManager,
}) => {
  const { t } = useI18n();

  return (
    <SettingsPageLayout
      title={t('settings.page.integrations.title')}
      description={t('settings.page.integrations.description')}
      showSaveStatus={false}
    >
      <ComingSoonMessengersSection />
      <JiraSection />
      <ThirdPartyIntegrationsSection
        onOpenProviderSetup={onOpenProviderSetup}
        onOpenPluginManager={onOpenPluginManager}
      />
    </SettingsPageLayout>
  );
};
