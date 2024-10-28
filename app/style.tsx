// /app/style.tsx
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Layout & Container Styles
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    paddingTop: 8,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flex: 1,
  },
  rewardCard: {
    backgroundColor: '#f8f4ff',
    borderWidth: 1,
    borderColor: '#e0d0ff',
  },

  // Typography
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metadata: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Points & Badges
  pointsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pointsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  rewardPoints: {
    color: '#6200ee',
    fontWeight: '600',
  },

  // Streak Indicators
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  streakText: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
    marginLeft: 4,
  },
  highStreakText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },

  // Button Styles
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Form Styles
  formSection: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e4e9',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formNumberInput: {
    textAlign: 'right',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },

  // Frequency Selector Styles
  frequencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e4e9',
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  frequencyOptionText: {
    color: '#333',
    fontSize: 16,
  },
  frequencyOptionTextSelected: {
    color: '#fff',
  },

  // Reorderable List Styles
  reorderableItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12,
  },
  reorderControls: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reorderButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginVertical: 4,
  },
  reorderButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  reorderableItemContent: {
    flex: 1,
  },

  // Date Picker Styles
  datePickerButton: {
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e4e9',
  },
});

export default styles;