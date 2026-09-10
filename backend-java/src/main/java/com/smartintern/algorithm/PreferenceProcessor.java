package com.smartintern.algorithm;

import com.smartintern.model.Preference;
import java.util.*;

/**
 * Validates, deduplicates, and orders student preferences.
 */
public class PreferenceProcessor {

    public static Map<String, List<Preference>> groupAndOrderPreferences(List<Preference> preferences) {
        Map<String, List<Preference>> grouped = new HashMap<>();

        for (Preference pref : preferences) {
            grouped.computeIfAbsent(pref.getStudentId(), k -> new ArrayList<>()).add(pref);
        }

        // Sort preferences for each student ascending by rank (Rank 1 is top priority)
        for (List<Preference> list : grouped.values()) {
            list.sort(Comparator.comparingInt(Preference::getRank));
        }

        return grouped;
    }
}
