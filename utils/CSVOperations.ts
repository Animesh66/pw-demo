import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './Logger';

/**
 * CSVOperations - Utility class for reading and parsing CSV files
 * Provides static methods for CSV data operations
 */
export class CSVOperations {
    private static dataDirectory: string = path.join(process.cwd(), 'data', 'csv');
    
    /**
     * Read CSV file and return data as array of objects
     * @param fileName - Name of the CSV file (with or without .csv extension)
     * @returns Array of objects where keys are column headers
     */
    static readCSV(fileName: string): any[] {
        try {
            const filePath = this.getFilePath(fileName);
            Logger.info(`Reading CSV file: ${filePath}`);
            
            if (!fs.existsSync(filePath)) {
                Logger.error(`CSV file not found: ${filePath}`);
                throw new Error(`CSV file not found: ${filePath}`);
            }
            
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const data = this.parseCSV(fileContent);
            
            Logger.success(`Successfully read ${data.length} rows from CSV file`);
            return data;
        } catch (error) {
            Logger.error('Failed to read CSV file', error);
            throw error;
        }
    }
    
    /**
     * Read specific row from CSV by index (0-based)
     * @param fileName - Name of the CSV file
     * @param rowIndex - Index of the row to read
     * @returns Object representing the row data
     */
    static readCSVRow(fileName: string, rowIndex: number): any {
        const data = this.readCSV(fileName);
        
        if (rowIndex < 0 || rowIndex >= data.length) {
            Logger.error(`Row index ${rowIndex} out of bounds. Total rows: ${data.length}`);
            throw new Error(`Row index ${rowIndex} out of bounds`);
        }
        
        Logger.info(`Reading row ${rowIndex} from CSV file`);
        return data[rowIndex];
    }
    
    /**
     * Read CSV and filter rows by column value
     * @param fileName - Name of the CSV file
     * @param columnName - Name of the column to filter by
     * @param value - Value to match
     * @returns Array of matching rows
     */
    static filterCSVByColumn(fileName: string, columnName: string, value: string): any[] {
        const data = this.readCSV(fileName);
        const filtered = data.filter(row => row[columnName] === value);
        
        Logger.info(`Filtered CSV data: Found ${filtered.length} matching rows for ${columnName}=${value}`);
        return filtered;
    }
    
    /**
     * Get specific column values from CSV
     * @param fileName - Name of the CSV file
     * @param columnName - Name of the column
     * @returns Array of column values
     */
    static getColumnValues(fileName: string, columnName: string): string[] {
        const data = this.readCSV(fileName);
        const values = data.map(row => row[columnName]);
        
        Logger.info(`Extracted ${values.length} values from column: ${columnName}`);
        return values;
    }
    
    /**
     * Read CSV and return as key-value pairs based on two columns
     * @param fileName - Name of the CSV file
     * @param keyColumn - Column to use as key
     * @param valueColumn - Column to use as value
     * @returns Object with key-value pairs
     */
    static readCSVAsKeyValue(fileName: string, keyColumn: string, valueColumn: string): Record<string, string> {
        const data = this.readCSV(fileName);
        const keyValuePairs: Record<string, string> = {};
        
        data.forEach(row => {
            keyValuePairs[row[keyColumn]] = row[valueColumn];
        });
        
        Logger.info(`Created ${Object.keys(keyValuePairs).length} key-value pairs from CSV`);
        return keyValuePairs;
    }
    
    /**
     * Get row count from CSV file
     * @param fileName - Name of the CSV file
     * @returns Number of data rows (excluding header)
     */
    static getRowCount(fileName: string): number {
        const data = this.readCSV(fileName);
        return data.length;
    }
    
    /**
     * Check if CSV file exists
     * @param fileName - Name of the CSV file
     * @returns Boolean indicating file existence
     */
    static fileExists(fileName: string): boolean {
        const filePath = this.getFilePath(fileName);
        return fs.existsSync(filePath);
    }
    
    /**
     * Parse CSV content into array of objects
     * @param content - CSV file content as string
     * @returns Array of objects
     */
    private static parseCSV(content: string): any[] {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
            Logger.warn('CSV file is empty');
            return [];
        }
        
        // Parse header row
        const headers = this.parseCSVLine(lines[0]);
        Logger.debug(`CSV Headers: ${headers.join(', ')}`);
        
        // Parse data rows
        const data: any[] = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            
            // Skip rows with incorrect column count
            if (values.length !== headers.length) {
                Logger.warn(`Row ${i} has ${values.length} columns, expected ${headers.length}. Skipping.`);
                continue;
            }
            
            // Create object from headers and values
            const row: any = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            
            data.push(row);
        }
        
        return data;
    }
    
    /**
     * Parse single CSV line handling quoted values
     * @param line - CSV line as string
     * @returns Array of column values
     */
    private static parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of field
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add last field
        result.push(current.trim());
        
        return result;
    }
    
    /**
     * Get full file path for CSV file
     * @param fileName - Name of the CSV file
     * @returns Full file path
     */
    private static getFilePath(fileName: string): string {
        // Add .csv extension if not present
        const fileNameWithExtension = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
        return path.join(this.dataDirectory, fileNameWithExtension);
    }
    
    /**
     * Set custom data directory path
     * @param directoryPath - Path to data directory
     */
    static setDataDirectory(directoryPath: string): void {
        this.dataDirectory = directoryPath;
        Logger.info(`CSV data directory set to: ${directoryPath}`);
    }
    
    /**
     * List all CSV files in data directory
     * @returns Array of CSV file names
     */
    static listCSVFiles(): string[] {
        try {
            if (!fs.existsSync(this.dataDirectory)) {
                Logger.warn(`Data directory does not exist: ${this.dataDirectory}`);
                return [];
            }
            
            const files = fs.readdirSync(this.dataDirectory)
                .filter(file => file.endsWith('.csv'));
            
            Logger.info(`Found ${files.length} CSV files in data directory`);
            return files;
        } catch (error) {
            Logger.error('Failed to list CSV files', error);
            return [];
        }
    }
}
