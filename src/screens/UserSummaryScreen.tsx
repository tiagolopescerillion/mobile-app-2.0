// src/screens/UserSummaryScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ContactMedium,
  FindUserRecord,
  fetchFindUser,
  RelatedParty,
} from '../services/findUserService';
import { useAccount } from '../context/AccountContext';
import { useSharedWebview } from '../context/SharedWebviewProvider';
import { useDesignSystem } from '../theme/DesignSystemProvider';

interface UserSummaryScreenProps {
  accessToken: string | null;
  onBack: () => void;
}

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 1;

export const UserSummaryScreen: React.FC<UserSummaryScreenProps> = ({
  accessToken,
  onBack,
}) => {
  const [records, setRecords] = useState<FindUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedAccountNumber, setSelectedAccountNumber } = useAccount();
  const { openWebview } = useSharedWebview();
  const { tokens } = useDesignSystem();

  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const loadData = useCallback(async () => {
    if (!accessToken) {
      setError('Missing access token. Please log in again.');
      setRecords([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchFindUser(accessToken, {
        offset: DEFAULT_OFFSET,
        limit: DEFAULT_LIMIT,
      });
      setRecords(result);
    } catch (err) {
      setRecords([]);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      loadData();
    }
  }, [accessToken, loadData]);

  const primaryRecord = records[0];

  const customerParties = useMemo(() => {
    if (!primaryRecord?.relatedParty) {
      return [];
    }
    return primaryRecord.relatedParty.filter(
      (party) => party['@referredType'] === 'Customer'
    );
  }, [primaryRecord]);

  const accountParties = useMemo(() => {
    if (!primaryRecord?.relatedParty) {
      return [];
    }
    return primaryRecord.relatedParty.filter(
      (party) =>
        party['@referredType'] === 'BillingAccountExtended' &&
        (party.role === 'OWNER' || party.role === 'ACCOWNER')
    );
  }, [primaryRecord]);

  useEffect(() => {
    const firstAccountId = accountParties[0]?.id ?? null;

    if (firstAccountId !== selectedAccountNumber) {
      setSelectedAccountNumber(firstAccountId);
    }
  }, [accountParties, selectedAccountNumber, setSelectedAccountNumber]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, tokens.semantic.text.title]}>User Profile</Text>
        <Text style={[styles.subtitle, tokens.semantic.text.description]}>
          Data retrieved from the APIMAN findUser endpoint.
        </Text>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.button, styles.primaryButton, (loading || !accessToken) && styles.buttonDisabled]}
            onPress={loadData}
            disabled={loading || !accessToken}
          >
            <Text style={[styles.buttonLabel, styles.primaryButtonLabel]}>Reload</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={onBack}
          >
            <Text style={[styles.buttonLabel, styles.secondaryButtonLabel]}>Back to Login</Text>
          </Pressable>
        </View>

        {!accessToken && (
          <Text style={[styles.warningText, tokens.semantic.text.body]}>
            You must log in before retrieving contact details.
          </Text>
        )}

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={tokens.semantic.button.primary.backgroundDefault as string} />
            <Text style={[styles.loadingText, tokens.semantic.text.description]}>
              Loading user details…
            </Text>
          </View>
        )}

        {error && (
          <Text style={[styles.errorText, tokens.semantic.text.body]}>
            Error: {error}
          </Text>
        )}

        {!loading && !error && primaryRecord && (
          <>
            {renderUserCard(primaryRecord, styles, tokens)}
            {renderContactMediums(primaryRecord.contactMedium, styles, tokens)}
            {renderCustomerCards(customerParties, styles, tokens)}
            {renderAccountCards(accountParties, styles, tokens)}

            <View style={styles.sectionSpacing}>
              <Text style={[styles.cardTitle, tokens.semantic.text.title]}>Account Webview</Text>
              <Text style={[styles.infoText, tokens.semantic.text.body]}>
                Opens the account overview webview for the selected account.
              </Text>
              <View style={[styles.selectedAccountCard, styles.sectionSpacing]}>
                <Text style={[styles.rowLabel, tokens.semantic.text.body]}>Selected Account</Text>
                <Text style={[styles.rowValue, tokens.semantic.text.body]}>
                  {selectedAccountNumber ?? 'Not selected yet'}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.button,
                  styles.secondaryButton,
                  !selectedAccountNumber && styles.buttonDisabled,
                ]}
                onPress={() => openWebview('selfServiceAccountOverview')}
                disabled={!selectedAccountNumber}
              >
                <Text style={[styles.buttonLabel, styles.secondaryButtonLabel]}>Open Account Overview</Text>
              </Pressable>
              {!selectedAccountNumber && (
                <Text style={[styles.infoText, tokens.semantic.text.body, styles.sectionSpacing]}>
                  Account selection will be available after account data loads.
                </Text>
              )}
            </View>
          </>
        )}

        {!loading && !error && records.length === 0 && accessToken && (
          <Text style={[styles.infoText, tokens.semantic.text.body]}>
            No records returned for this query.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

function renderUserCard(
  record: FindUserRecord,
  styles: ReturnType<typeof createStyles>,
  tokens: ReturnType<typeof useDesignSystem>['tokens']
) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={[styles.cardTitle, tokens.semantic.text.title]}>Contact Details</Text>
      <Row label="Contact ID" value={record.id} styles={styles} tokens={tokens} />
      <Row label="Full Name" value={record.fullName ?? '—'} styles={styles} tokens={tokens} />
      <Row label="Given Name" value={record.givenName ?? '—'} styles={styles} tokens={tokens} />
    </View>
  );
}

function renderContactMediums(
  mediums: ContactMedium[] | undefined,
  styles: ReturnType<typeof createStyles>,
  tokens: ReturnType<typeof useDesignSystem>['tokens']
) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={[styles.cardTitle, tokens.semantic.text.title]}>Contact Mediums</Text>
      {!mediums?.length && (
        <Text style={[styles.infoText, tokens.semantic.text.body]}>
          No contact mediums available.
        </Text>
      )}
      {mediums?.map((medium, index) => {
        const details =
          medium.characteristic?.emailAddress ??
          medium.characteristic?.phoneNumber ??
          medium.characteristic?.contactType ??
          '—';
        return (
          <Row
            key={`${medium.mediumType}-${index}`}
            label={medium.mediumType ?? `Medium ${index + 1}`}
            value={details}
            styles={styles}
            tokens={tokens}
          />
        );
      })}
    </View>
  );
}

function renderCustomerCards(
  parties: RelatedParty[],
  styles: ReturnType<typeof createStyles>,
  tokens: ReturnType<typeof useDesignSystem>['tokens']
) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={[styles.cardTitle, tokens.semantic.text.title]}>Customer Cards</Text>
      {!parties.length && (
        <Text style={[styles.infoText, tokens.semantic.text.body]}>
          No customer records available.
        </Text>
      )}
      {parties.map((party, index) => (
        <Row
          key={`${party.id ?? 'customer'}-${index}`}
          label="Customer Number"
          value={party.id ?? '—'}
          styles={styles}
          tokens={tokens}
        />
      ))}
    </View>
  );
}

function renderAccountCards(
  parties: RelatedParty[],
  styles: ReturnType<typeof createStyles>,
  tokens: ReturnType<typeof useDesignSystem>['tokens']
) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={[styles.cardTitle, tokens.semantic.text.title]}>Account Cards</Text>
      {!parties.length && (
        <Text style={[styles.infoText, tokens.semantic.text.body]}>
          No account records available.
        </Text>
      )}
      {parties.map((party, index) => (
        <Row
          key={`${party.id ?? 'account'}-${index}`}
          label="Account Number"
          value={party.id ?? '—'}
          styles={styles}
          tokens={tokens}
        />
      ))}
    </View>
  );
}

interface RowProps {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
  tokens: ReturnType<typeof useDesignSystem>['tokens'];
}

const Row: React.FC<RowProps> = ({ label, value, styles, tokens }) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, tokens.semantic.text.body]}>{label}</Text>
    <Text style={[styles.rowValue, tokens.semantic.text.body]}>{value}</Text>
  </View>
);

function createStyles(tokens: ReturnType<typeof useDesignSystem>['tokens']) {
  const pageDefaults = tokens.semantic.page.surface;
  const cardTokens = tokens.semantic.card.default;
  const primaryButton = tokens.semantic.button.primary;
  const secondaryButton = tokens.semantic.button.secondary;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: tokens.semantic.page.default.backgroundColor,
    },
    container: {
      padding: tokens.primitives.spacing.md,
      paddingBottom: tokens.primitives.spacing.lg,
      gap: tokens.primitives.spacing.sm,
      backgroundColor: pageDefaults.backgroundColor,
    },
    title: {},
    subtitle: {},
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: tokens.primitives.spacing.md,
      marginBottom: tokens.primitives.spacing.sm,
      gap: tokens.primitives.spacing.sm,
    },
    button: {
      flex: 1,
      borderRadius: primaryButton.borderRadius,
      paddingVertical: primaryButton.paddingVertical,
      paddingHorizontal: primaryButton.paddingHorizontal,
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    primaryButton: {
      backgroundColor: primaryButton.backgroundDefault,
      borderWidth: primaryButton.borderWidth,
      borderColor: primaryButton.borderColor,
    },
    secondaryButton: {
      backgroundColor: secondaryButton.backgroundDefault,
      borderWidth: secondaryButton.borderWidth,
      borderColor: secondaryButton.borderColor,
    },
    buttonLabel: {
      fontSize: primaryButton.fontSize,
      fontWeight: `${primaryButton.fontWeight}` as TextStyle['fontWeight'],
    },
    primaryButtonLabel: {
      color: primaryButton.textColorDefault,
    },
    secondaryButtonLabel: {
      color: secondaryButton.textColorDefault,
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: tokens.primitives.spacing.sm,
      gap: tokens.primitives.spacing.xs,
    },
    loadingText: {},
    warningText: {
      color: tokens.primitives.palettes.primary.dark as string,
      backgroundColor: tokens.primitives.palettes.primary.lightest as string,
      padding: tokens.primitives.spacing.sm,
      borderRadius: tokens.primitives.radius.md,
      borderWidth: tokens.primitives.borderWidth.thin,
      borderColor: tokens.primitives.palettes.primary.light as string,
    },
    errorText: {
      color: tokens.primitives.palettes.secondary.dark as string,
      backgroundColor: tokens.primitives.palettes.secondary.lightest as string,
      padding: tokens.primitives.spacing.sm,
      borderRadius: tokens.primitives.radius.md,
      borderWidth: tokens.primitives.borderWidth.thin,
      borderColor: tokens.primitives.palettes.secondary.light as string,
    },
    infoText: {},
    card: {
      backgroundColor: cardTokens.backgroundColor,
      borderRadius: cardTokens.borderRadius,
      padding: cardTokens.padding,
      shadowColor: tokens.primitives.palettes.neutral.black as string,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: cardTokens.elevation,
      borderWidth: cardTokens.borderWidth,
      borderColor: cardTokens.borderColor,
    },
    cardTitle: {
      fontSize: tokens.primitives.typography.bodyFontSize as number,
      fontWeight: tokens.primitives.typography.titleFontWeight as any,
      marginBottom: tokens.primitives.spacing.xs,
      color: tokens.primitives.colors.textPrimary as string,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: tokens.primitives.colors.border as string,
      paddingVertical: tokens.primitives.spacing.xs,
    },
    rowLabel: {},
    rowValue: {},
    sectionSpacing: {
      marginTop: tokens.primitives.spacing.md,
    },
    selectedAccountCard: {
      padding: tokens.primitives.spacing.sm,
      backgroundColor: tokens.primitives.colors.surface as string,
      borderRadius: tokens.primitives.radius.md,
      marginBottom: tokens.primitives.spacing.xs,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens.primitives.colors.border as string,
    },
  });
}
