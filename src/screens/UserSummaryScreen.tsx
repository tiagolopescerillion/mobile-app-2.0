// src/screens/UserSummaryScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ContactMedium,
  FindUserRecord,
  fetchFindUser,
  RelatedParty,
} from '../services/findUserService';

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        <Text style={styles.subtitle}>
          Data retrieved from the APIMAN findUser endpoint.
        </Text>

        <View style={styles.actionsRow}>
          <Button title="Reload" onPress={loadData} disabled={loading || !accessToken} />
          <Button title="Back to Login" onPress={onBack} />
        </View>

        {!accessToken && (
          <Text style={styles.warningText}>
            You must log in before retrieving contact details.
          </Text>
        )}

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Loading user details…</Text>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && primaryRecord && (
          <>
            {renderUserCard(primaryRecord)}
            {renderContactMediums(primaryRecord.contactMedium)}
            {renderCustomerCards(customerParties)}
            {renderAccountCards(accountParties)}
          </>
        )}

        {!loading && !error && records.length === 0 && accessToken && (
          <Text style={styles.infoText}>No records returned for this query.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

function renderUserCard(record: FindUserRecord) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={styles.cardTitle}>Contact Details</Text>
      <Row label="Contact ID" value={record.id} />
      <Row label="Full Name" value={record.fullName ?? '—'} />
      <Row label="Given Name" value={record.givenName ?? '—'} />
    </View>
  );
}

function renderContactMediums(mediums?: ContactMedium[]) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={styles.cardTitle}>Contact Mediums</Text>
      {!mediums?.length && (
        <Text style={styles.infoText}>No contact mediums available.</Text>
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
          />
        );
      })}
    </View>
  );
}

function renderCustomerCards(parties: RelatedParty[]) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={styles.cardTitle}>Customer Cards</Text>
      {!parties.length && (
        <Text style={styles.infoText}>No customer records available.</Text>
      )}
      {parties.map((party, index) => (
        <Row
          key={`${party.id ?? 'customer'}-${index}`}
          label="Customer Number"
          value={party.id ?? '—'}
        />
      ))}
    </View>
  );
}

function renderAccountCards(parties: RelatedParty[]) {
  return (
    <View style={[styles.card, styles.sectionSpacing]}>
      <Text style={styles.cardTitle}>Account Cards</Text>
      {!parties.length && (
        <Text style={styles.infoText}>No account records available.</Text>
      )}
      {parties.map((party, index) => (
        <Row
          key={`${party.id ?? 'account'}-${index}`}
          label="Account Number"
          value={party.id ?? '—'}
        />
      ))}
    </View>
  );
}

interface RowProps {
  label: string;
  value: string;
}

const Row: React.FC<RowProps> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    color: '#6b7280',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  loadingText: {
    color: '#374151',
    marginLeft: 8,
  },
  warningText: {
    color: '#92400e',
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 8,
  },
  infoText: {
    color: '#4b5563',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    paddingVertical: 6,
  },
  rowLabel: {
    fontWeight: '500',
    color: '#111827',
  },
  rowValue: {
    color: '#1f2937',
  },
  sectionSpacing: {
    marginTop: 16,
  },
});
